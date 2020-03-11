//import Result Files

async function uploadResultData(dbMaster,aggregatedResults) {

    var batch = dbMaster.batch();
    const results = dbMaster.collection('results');
    let documentCounter = 1;
    Object.values(aggregatedResults)
        .sort((r1, r2) => r1.lastUpdateTime - r2.lastUpdateTime)
        .forEach(async (resultDocument) => {
            resultDocument.lastUpdateTime = new Date().getTime();
            let documentId = Object.keys(resultDocument)[0];
            dbMaster.collection('results').doc('result-' + documentCounter++).set(resultDocument);
        });
  }
   const  ImportResultData=(dbMaster,importList)=>{
    let aggregatedResults = aggregateResults(10, 5,importList);
    uploadResultData(dbMaster,aggregatedResults)
    .then(() => {
        console.log("Writing data, exiting in 10 seconds ...\n\n");
  
        setTimeout(() => {
  
            console.log("\n\n\nData Upload Completed.\n\n\n");
         //   process.exit(0);
  
        }, 10000);
  
    })
    .catch(err => {
        console.log("Data upload failed, reason:", err, '\n\n\n');
       // process.exit(-1);
    });
  }
  
  
  function aggregateResults(noOfDocumentToCreate, recordsInEachDocuments,importList) {
    try {
        let data = [];
        let resultCounter = 0;
        let documentCounter = 1;
        let results = [];
        for (let i = 0; i < importList.length; i++) {
            const result = importList[i];
            if (resultCounter === recordsInEachDocuments) {
                data['results-' + documentCounter++] = {
                    // timestamp: new Date().getTime(),
                    results: [...results]
                }
                results.length = 0;
                if (documentCounter <= noOfDocumentToCreate) {
                    results.push(result);
                    resultCounter = 1;
                }
            } else {
                results.push(result);
                resultCounter++;
            }
  
            if (documentCounter > noOfDocumentToCreate) {
                break;
            }
        }
  
        if (results.length) {
            data['results-' + documentCounter++] = {
                timestamp: new Date().getTime(),
                results: results
            }
        }
  
        return data;
    } catch (e) {
        console.log(e.message);
    }
  }
  
  export default ImportResultData;
  
  
  
  //End Of import Result Files