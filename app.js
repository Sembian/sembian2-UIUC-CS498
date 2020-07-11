
// Data preparation.
  function ready(data){
    console.log('Local CSV in ready!:', data);
  }

// Load data
d3.csv('data.csv').then( res => {
    console.log('Local CSV:', res);
    ready(res);
});