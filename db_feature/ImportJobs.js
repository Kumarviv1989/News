import * as firebase from "firebase";

async function uploadData(DbMaster,aggregatedJobs) {

    var batch = DbMaster.batch();

    const jobs = DbMaster.collection('jobs');
    let documentCounter = 1;
    Object.values(aggregatedJobs)
        .sort((r1, r2) => r1.lastUpdateTime - r2.lastUpdateTime)
        .forEach(async (jobDocument) => {
            jobDocument._createdDate = firebase.firestore.FieldValue.serverTimestamp();
            let documentId = Object.keys(jobDocument)[0];
            DbMaster.collection('jobs').doc('job-' + documentCounter++).set(jobDocument);
        });
}
const  importJobs=async (dbMaster,importList)=>{
    let aggregatedJobs = aggregateJobs(1, 100,importList);
    uploadData(dbMaster,aggregatedJobs)
        .then(() => {
            console.log("Writing data, exiting in 10 seconds ...\n\n");

            setTimeout(() => {

                console.log("\n\n\nData Upload Completed.\n\n\n");
             //   process.exit(0);

            }, 10000);

        })
        .catch(err => {
            console.log("Data upload failed, reason:", err, '\n\n\n');
          //  process.exit(-1);
        });
}


function aggregateJobs(noOfDocumentToCreate, recordsInEachDocuments,importList) {
    try {
        let data = [];
        let jobCounter = 0;
        let documentCounter = 1;
        let jobs = [];
        for (let i = 0; i < importList.length; i++) {
            let job = importList[i];
            if (jobCounter === recordsInEachDocuments) {
                data['jobs-' + documentCounter++] = {
                    // timestamp: new Date().getTime(),
                    jobs: [...jobs]
                }
                jobs.length = 0;
                if (documentCounter <= noOfDocumentToCreate) {
                    jobs.push(job);
                    jobCounter = 1;
                }
            } else {
                // job.timestamp = new Date().getTime();
                job = { ...job, id: ++jobCounter };
                let vacancyCounter = 0;
                job.vacancyDetail = (job.vacancyDetail).map(vacancy => {
                    vacancy = { ...vacancy, id: ++vacancyCounter };
                    return vacancy
                });
                // console.log(job)
                jobs.push(job);
            }

            if (documentCounter > noOfDocumentToCreate) {
                break;
            }
        }

        if (jobs.length) {
            data['jobs-' + documentCounter++] = {
                timestamp: new Date().getTime(),
                jobs: jobs
            }
        }

        return data;
    } catch (e) {
        console.log(e.message);
    }
}
export default importJobs;
