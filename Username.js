function fetchContentFromDomain(domain) {
  fetch(`https://${domain}`)
  .then(response => response.text())
  .then(html => {
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = html;
      
      const element = tempContainer.querySelector("#main-content > div > div:nth-child(2) > div > div.dark-background.svelte-1p2dszo > div > div.authenticated-wrapper.svelte-1p2dszo > h1");
      if (element) {
          const textContent = element.textContent;
          const words = textContent.split(' ');
          const lastWord = words[words.length - 1];
          const username = lastWord.trim();
          const newDiv = document.createElement('div');
          const welcomeText = document.createTextNode(`Welcome ${username}!`);
          const welcomeText2 = document.createTextNode(`Stake Code Claimer Loaded.`);
          const claimerText = document.createTextNode(`Please keep the extension page open.`);
          const luckText = document.createTextNode('Good Luck...');
          newDiv.style.fontSize = '14px';
          newDiv.style.color = 'white';
          newDiv.style.marginLeft = '15px';
          newDiv.style.fontFamily = 'Arial';
          newDiv.style.fontWeight = 'bold';
          newDiv.appendChild(welcomeText);
          newDiv.appendChild(document.createElement('br'));
          newDiv.appendChild(welcomeText2);
          const referenceNode = document.querySelector("#svelte > div.wrap.svelte-sizi7f > div.main-content.svelte-sizi7f > div.navigation.svelte-1ekwux9 > div > div > div > div.stack.x-flex-start.y-center.gap-smaller.padding-none.direction-horizontal.padding-left-auto.padding-top-auto.padding-bottom-auto.padding-right-auto.svelte-1mgzzos > div");

          if (referenceNode) {
            referenceNode.parentNode.insertBefore(newDiv, referenceNode.nextSibling);
          } else {
            console.error('Reference node not found');
          }
      } else {
          console.error("Element not found in fetched content");
      }
  })
  .catch(error => {
      console.error("Error fetching content:", error);
  });
}

const currentDomain = window.location.hostname;
console.log("Current Domain:", currentDomain);

fetchContentFromDomain(currentDomain);
