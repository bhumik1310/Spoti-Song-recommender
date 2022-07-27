const axios = window.axios
const handlebars = window.Handlebars

const output = document.getElementById("recommendation-output")
const button = document.getElementById("submitButton")

const buttonActive = () =>{
  button.disabled = false
  button.value = "Get Recommendations"
}

const buttonLoading = () =>{
  button.disabled = true
  button.value = "Loading..."
}

// any console.log in this file will appear the browser console
console.log("Hello from script.js!")

const submitForm = async (event)=>{
  
  event.preventDefault()
  
  buttonLoading()
  
  const elements = event.target.elements
  const artist1 = elements.artist1.value
  const artist2 = elements.artist2.value
  const artist3 = elements.artist3.value
  
  let result
  try{
    result = await axios.post("/recommendations", {artist1, artist2, artist3})
  }catch(err){
    return alert(err.message)
  }
  const recommendations = result.data.tracks
  const topFive = recommendations.slice(0,5)
  
  const template = handlebars.compile(templateRaw, {artist1, artist2, artist3, topFive})
  const html = template({artist1, artist2, artist3, topFive})
  output.innerHTML = html
  
  buttonActive()
}

const templateRaw = `
<h3 align="center">Nice Artist Choices!</h3>
<p align="center">If you like {{artist1}}, {{artist2}} and {{artist3}}, maybe take a listen to these:</p>
<ul >
  {{#each topFive}}
  <li align="center">{{name}} - <a href="{{external_urls.spotify}}">Play</a></li>
  {{/each}}
</ul>
`