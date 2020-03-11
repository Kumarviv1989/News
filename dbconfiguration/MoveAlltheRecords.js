const GetAllCollection = async function(source,destination) {
 try{
  let res = await DBCopyAndMove(source,destination,'jobs');
  console.log(res);
  if (res){
    res = await DBCopyAndMove(source,destination,'admitcards');
  }

  if (res){
    res = await DBCopyAndMove(source,destination,'results');
  }

  if (res){
     res = await DBCopyAndMove(source,destination,'categories');
  }
}
catch(error){
    console.log(error.message);
}
}

async function DBCopyAndMove(source,destination,ActionType) {
  try {
    let jobDocuments = [];
    await source
      //.collection("jobs")
      .collection(ActionType)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          jobDocuments = [
            {
              id: doc.id,
              jobs: doc.data()
            }
          ];
        });
      });
    jobDocuments.forEach(document => {
      destination
        .collection(ActionType)
        .doc(document.id)
        .set(document.jobs);
    });
    return true;
  } catch (error) {
    console.log("Error At MoveAlltheRecord >> copyjobs ", error.message);
    return false;
  }
}
export default GetAllCollection;
