// ==========================================================
// CONFIG
// ==========================================================

const inboundFile = "inbound.csv";
const outboundFile = "outbound.csv";

let inboundData = [];
let outboundData = [];


// ==========================================================
// START
// ==========================================================

window.onload = async () => {

    await loadInbound();

    await loadOutbound();

    buildInboundBrand();

    buildInboundArrival();

    buildOutboundPosted();

    buildOutboundPending();

};


// ==========================================================
// LOAD CSV
// ==========================================================

function loadCSV(file){

    return new Promise((resolve,reject)=>{

        Papa.parse(file,{

            download:true,

            header:true,

            skipEmptyLines:true,

            complete:(result)=>{

                resolve(result.data);

            },

            error:(err)=>{

                reject(err);

            }

        });

    });

}


async function loadInbound(){

    inboundData = await loadCSV(inboundFile);

    console.log("Inbound",inboundData.length);

}


async function loadOutbound(){

    outboundData = await loadCSV(outboundFile);

    console.log("Outbound",outboundData.length);

}



// ==========================================================
// PIVOT 1
// PULLBACK BY BRAND
// ==========================================================

function buildInboundBrand(){

    const table =
        document.querySelector("#tblInboundBrand tbody");

    table.innerHTML="";

    const pivot={};

    inboundData.forEach(r=>{

        const brand=r.brand || r.brand_name;

        if(!brand) return;

        if(!pivot[brand]){

            pivot[brand]={

                box:0,
                product:0

            };

        }

        pivot[brand].box += Number(r.box || r.box_qty || 0);

        pivot[brand].product += Number(r.product || r.product_qty || 0);

    });


    let totalBox=0;

    let totalProduct=0;


    Object.keys(pivot)
    .sort()
    .forEach(brand=>{

        totalBox+=pivot[brand].box;

        totalProduct+=pivot[brand].product;

        table.insertAdjacentHTML(

            "beforeend",

            `
            <tr>

                <td>${brand}</td>

                <td>${pivot[brand].box.toLocaleString()}</td>

                <td>${pivot[brand].product.toLocaleString()}</td>

            </tr>

            `

        );

    });


    document.getElementById("brandTotalBox").innerText=
        totalBox.toLocaleString();

    document.getElementById("brandTotalProduct").innerText=
        totalProduct.toLocaleString();

}



// ==========================================================
// PIVOT 2
// ARRIVAL DATE
// ==========================================================

function buildInboundArrival(){

    const table=
        document.querySelector("#tblInboundArrival tbody");

    table.innerHTML="";

    const pivot={};


    inboundData.forEach(r=>{

        const date=r.arrival_date;

        if(!date) return;

        if(!pivot[date]){

            pivot[date]={

                product:0,
                taras:0,
                paper:0,
                vm:0

            };

        }

        pivot[date].product+=Number(r.product_qty||0);

        pivot[date].taras+=Number(r.taras_qty||0);

        pivot[date].paper+=Number(r.paper_qty||0);

        pivot[date].vm+=Number(r.vm_qty||0);

    });


    let p=0;
    let t=0;
    let pa=0;
    let vm=0;


    Object.keys(pivot)
    .sort()
    .forEach(date=>{

        p+=pivot[date].product;

        t+=pivot[date].taras;

        pa+=pivot[date].paper;

        vm+=pivot[date].vm;


        table.insertAdjacentHTML(

            "beforeend",

            `

            <tr>

            <td>${date}</td>

            <td>${pivot[date].product.toLocaleString()}</td>

            <td>${pivot[date].taras.toLocaleString()}</td>

            <td>${pivot[date].paper.toLocaleString()}</td>

            <td>${pivot[date].vm.toLocaleString()}</td>

            </tr>

            `

        );

    });


    arrivalProduct.innerText=p.toLocaleString();

    arrivalTaras.innerText=t.toLocaleString();

    arrivalPaper.innerText=pa.toLocaleString();

    arrivalVm.innerText=vm.toLocaleString();

}



// ==========================================================
// PIVOT 3
// OUTBOUND POSTED
// ==========================================================

function buildOutboundPosted(){

    const table = document.querySelector("#tblOutboundPosted tbody");
    table.innerHTML = "";

    const pivot = {};

    outboundData
        .filter(r => String(r.check).trim().toLowerCase() === "posted")
        .forEach(r => {

            const brand = r.brand_name;

            if(!pivot[brand]){
                pivot[brand] = {
                    product:0,
                    paper:0
                };
            }

            pivot[brand].product += Number(r.product_qty || 0);
            pivot[brand].paper += Number(r.paper_qty || 0);

        });

    let product = 0;
    let paper = 0;

    Object.keys(pivot).sort().forEach(brand => {

        product += pivot[brand].product;
        paper += pivot[brand].paper;

        table.insertAdjacentHTML("beforeend",`
        <tr>
            <td>${brand}</td>
            <td>${pivot[brand].product.toLocaleString()}</td>
            <td>${pivot[brand].paper.toLocaleString()}</td>
        </tr>
        `);

    });

    postedProduct.innerText = product.toLocaleString();
    postedPaper.innerText = paper.toLocaleString();
}


// ==========================================================
// PIVOT 4
// OUTBOUND PENDING
// ==========================================================

function buildOutboundPending(){

    const table = document.querySelector("#tblOutboundPending tbody");
    table.innerHTML = "";

    let total = 0;

    outboundData
        .filter(r => String(r.check).trim().toLowerCase() !== "posted")
        .forEach(r => {

            total += Number(r.order_qty || 0);

            table.insertAdjacentHTML("beforeend",`
            <tr>
                <td>${r.brand_name}</td>
                <td>${r.shop_name}</td>
                <td>${r.DO_num}</td>
                <td>${r.type}</td>
                <td>${Number(r.order_qty || 0).toLocaleString()}</td>
            </tr>
            `);

        });

    pendingQty.innerText = total.toLocaleString();
}