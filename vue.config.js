module.exports = {
    devServer:  {
       
      proxy: {
        "/": {
          target: "https://pgm-services.herokuapp.com/",
          
      
                    
        },
      }
    }
  }
