function uploadFile() {
    const fileInput = document.getElementById("excelFile");
    const file = fileInput.files[0];
  
    const formData = new FormData();
    formData.append("excelFile", file);

    fetch("/getColumns", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        
        console.log(data);
        // Now add the appropriate divs and stuff
      })
      .catch((error) => console.error(error));
  }
  