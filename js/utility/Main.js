function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
}

includeHTML();

function GetSearchParams(overrideURL) {
  return new URLSearchParams(new URL(overrideURL ? overrideURL : window.location.href).search);
}

function SearchParamsUrl(searchParams) {
  return window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString();

}

function UpdateUrlParams(searchParams) {
  window.location.href = SearchParamsUrl(searchParams);
}


function SmoothScrollToTop() {
  // Get the current Y position of the scroll
  const currentY = window.scrollY;

  // Set the animation duration (in milliseconds)
  const duration = 100;

  // Calculate the number of steps for the animation
  const step = Math.round(currentY / (duration / 15));

  // Perform the animation
  let i = 0;
  const scrollInterval = setInterval(() => {
      // Scroll to the next step
      window.scrollTo(0, currentY - (step * i));

      // Increment the step counter
      i++;

      // If we've reached the top of the page, clear the interval
      if (currentY - (step * i) <= 0) {
          clearInterval(scrollInterval);
      }
  }, 15);
}


function SmoothScrollToElement(element) {

  // Check if the element exists
  if (element) {
      // Scroll the element into view with smooth behavior
      element.scrollIntoView({ behavior: 'smooth' });
  }
}