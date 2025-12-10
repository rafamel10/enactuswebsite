(function () {
  const nav = document.querySelector(".navbar.custom-transparent");
  const banner = document.getElementById("banner");
  if (!nav || !banner) return;

  let threshold = 0;

  function updateThreshold() {
    threshold = banner.offsetHeight - nav.offsetHeight;
    if (threshold < 0) threshold = 0;
  }

  function onScroll() {
    if (window.scrollY > threshold) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  window.addEventListener("load", function () {
    updateThreshold();
    onScroll();
  });

  window.addEventListener("resize", function () {
    updateThreshold();
    onScroll();
  });

  window.addEventListener("scroll", onScroll, { passive: true });
})();

(function () {
  var searchInput = document.getElementById("searchInput");
  var searchBtn = document.getElementById("searchBtn");
  var popup = document.getElementById("popup");
  var popupText = document.getElementById("popupText");
  var closeBtn = document.getElementById("closeBtn");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var content = document.getElementById("content");

  // checar se existem
  if (
    !searchInput ||
    !searchBtn ||
    !popup ||
    !popupText ||
    !closeBtn ||
    !prevBtn ||
    !nextBtn ||
    !content
  ) {
    console.error("Elementos de search não encontrados.");
    return;
  }

  var originalHTML = content.innerHTML;
  var currentIndex = 0;
  var totalMatches = 0;

  function clearHighlights() {
    content.innerHTML = originalHTML;
  }

  function updateDisplay() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalMatches - 1;

    popupText.textContent = (currentIndex + 1) + "/" + totalMatches + " ocorrência(s)";
  }

  function goToMatch(index) {
    var highlights = document.querySelectorAll(".highlight");
    if (highlights.length === 0) return;

    for (var i = 0; i < highlights.length; i++) {
      highlights[i].classList.remove("active");
    }

    highlights[index].classList.add("active");
    highlights[index].scrollIntoView({ behavior: "smooth", block: "center" });

    currentIndex = index;
    updateDisplay();
  }

  function doSearch() {
    var searchTerm = searchInput.value.trim();

    clearHighlights();

    if (searchTerm === "") {
      popup.classList.remove("show");
      return;
    }

    var escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var regex = new RegExp(escapedTerm, "gi");

    // contar ocorrências no content
    var textContent = content.textContent || content.innerText;
    var matches = textContent.match(regex);
    totalMatches = matches ? matches.length : 0;

    if (totalMatches === 0) {
      popupText.textContent = "Sem ocorrências encontradas.";
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      popup.classList.add("show");
      return;
    }

    // grifar text nodes
    highlightTextNodes(content, regex);

    currentIndex = 0;
    popup.classList.add("show");
    goToMatch(0);
  }

  function highlightTextNodes(element, regex) {
    var walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    var nodesToReplace = [];
    var node;

    while ((node = walker.nextNode())) {
      if (node.nodeValue.match(regex)) {
        nodesToReplace.push(node);
      }
    }

    nodesToReplace.forEach(function (node) {
      var text = node.nodeValue;
      var parts = text.split(regex);
      var matchedParts = text.match(regex);

      if (!matchedParts) return;

      var fragment = document.createDocumentFragment();
      var matchIndex = 0;

      parts.forEach(function (part, i) {
        if (part) {
          fragment.appendChild(document.createTextNode(part));
        }
        if (i < parts.length - 1 && matchedParts[matchIndex]) {
          var span = document.createElement("span");
          span.className = "highlight";
          span.textContent = matchedParts[matchIndex];
          fragment.appendChild(span);
          matchIndex++;
        }
      });

      node.parentNode.replaceChild(fragment, node);
    });
  }

  searchBtn.addEventListener("click", function (e) {
    e.preventDefault();
    doSearch();
  });

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      doSearch();
    }
  });

  // tirar grifado ao apagar o input
  searchInput.addEventListener("input", function (e) {
    if (e.target.value.trim() === "") {
      clearHighlights();
      popup.classList.remove("show");
    }
  });

  closeBtn.addEventListener("click", function () {
    popup.classList.remove("show");
    clearHighlights();
  });

  prevBtn.addEventListener("click", function () {
    if (currentIndex > 0) {
      goToMatch(currentIndex - 1);
    }
  });

  nextBtn.addEventListener("click", function () {
    if (currentIndex < totalMatches - 1) {
      goToMatch(currentIndex + 1);
    }
  });
})();

// Layout inteligente para áreas do time
(function() {
  function adjustTeamLayouts() {
    const areas = document.querySelectorAll('.team-area');
    
    areas.forEach(area => {
      const count = area.querySelectorAll('.card').length;
      
      // Remove classes existentes
      area.classList.remove('layout-3', 'layout-4');
      
      // Lógica de divisão inteligente para evitar 1 membro sozinho
      if (count === 1 || count === 2 || count === 3) {
        // 1-3: usa 3 por linha (padrão)
      } else if (count === 4 || count === 6 || count === 7 || count === 8) {
        // 4, 6, 7, 8: usa 4 por linha
        area.classList.add('layout-4');
      } else if (count === 5 || count === 9) {
        // 5, 9: usa 3 por linha (3+2 ou 3+3+3)
      } else if (count % 4 === 0 || count % 4 === 2 || count % 4 === 3) {
        // Divisível por 4, ou resto 2/3: usa 4 por linha
        area.classList.add('layout-4');
      }
      // Resto 1: usa 3 por linha para evitar 1 sozinho
    });
  }

  // Executa ao carregar e ao redimensionar
  window.addEventListener('load', adjustTeamLayouts);
  window.addEventListener('resize', adjustTeamLayouts);
})();

// document.addEventListener('DOMContentLoaded', function() {
//     const navbar = document.querySelector('.navbar'); // Ajuste se a classe do seu menu for outra
//     const urlAtual = window.location.href;

//     const mapaDeCores = {
//         'ecoplan': 'bg-ecoplan',
//         'revalorize': 'bg-reva',
//         'ativamente': 'bg-ativa',
//         'organogas': 'bg-organo'
//     };

//     // O código verifica qual página é e aplica a classe correta
//     for (const [pagina, classeCor] of Object.entries(mapaDeCores)) {
//         if (urlAtual.includes(pagina)) {
//             navbar.classList.add(classeCor);
//             break; // Para de procurar assim que achar a correspondência
//         }
//     }
// });