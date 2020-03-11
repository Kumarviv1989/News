//Import Admit Card //

async function uploadData(dbMaster,aggregatedAdmitCards) {
    var batch = dbMaster.batch();

    let documentCounter = 1;
    Object.values(aggregatedAdmitCards)
      .sort((r1, r2) => r1.lastUpdateTime - r2.lastUpdateTime)
      .forEach(async admitCardDocument => {
        admitCardDocument.lastUpdateTime = new Date().getTime();
        // Auto generate Id
        // results.add(result);

        // Custom Id
        let documentId = Object.keys(admitCardDocument)[0];
        dbMaster
          .collection("admitcards")
          .doc("admitcards-" + documentCounter++)
          .set(admitCardDocument);
      });
  }

const ImportAdmitCards=(dbMaster,importList)=>{
    let aggregatedAdmitCards = aggregateAdmitCards(10, 5,importList);

    uploadData(dbMaster,aggregatedAdmitCards)
    .then(() => {
          console.log("Writing data, exiting in 10 seconds ...\n\n");
          setTimeout(() => {
              console.log("\n\n\nData Upload Completed.\n\n\n");
          }, 10000);

      })
      .catch(err => {
          console.log("Data upload failed, reason:", err, '\n\n\n');
         // process.exit(-1);
      });
  }

 function aggregateAdmitCards(noOfDocumentToCreate, recordsInEachDocuments,importList) {
    try {
      let data = [];
      let admitCardCounter = 0;
      let documentCounter = 1;
      let admitCards = [];
      for (let i = 0; i < importList.length; i++) {
        const admitCard = importList[i];
        if (admitCardCounter === recordsInEachDocuments) {
          data["admitcards-" + documentCounter++] = {
            // timestamp: new Date().getTime(),
            admitCards: [...admitCards]
          };
          admitCards.length = 0;
          if (documentCounter <= noOfDocumentToCreate) {
            admitCards.push(admitCard);
            admitCardCounter = 1;
          }
        } else {
          admitCards.push(admitCard);
          admitCardCounter++;
        }

        if (documentCounter > noOfDocumentToCreate) {
          break;
        }
      }

      if (admitCards.length) {
        data["admitcards-" + documentCounter++] = {
          timestamp: new Date().getTime(),
          admitCards: admitCards
        };
      }

      return data;
    } catch (e) {
      console.log(e.message);
    }
  }

  export default ImportAdmitCards;