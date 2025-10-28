document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const iconToggleTheme = document.getElementById("icon-toogle-theme");
  const form = document.getElementById("formContato");
  const mensagemConfirmacao = document.getElementById("mensagemConfirmacao");
  const container = document.getElementById("habilidades-container");
  const limparBtn = document.getElementById("limpar-btn");

  const toggleTheme = () => {
    const currentTheme = body.getAttribute("data-bs-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    body.setAttribute("data-bs-theme", newTheme);

    if (iconToggleTheme) {
      iconToggleTheme.className = newTheme === "dark" ? "bi bi-moon-stars" : "bi bi-brightness-high";
    }

    updateBadgesTheme(newTheme);
  };

  window.toggleTheme = toggleTheme;

  const habilidades = {
    linguagens: ["Python", "JavaScript", "TypeScript", "HTML", "CSS"],
    frameworks: ["React.js", "Node.js", "Django", "Angular", "NestJS"],
    ferramentas: ["Git", "Docker", "VS Code", "Figma"],
    softskills: ["Comunicação", "Trabalho em equipe", "Resolução de problemas", "Proatividade"]
  };

  if (!container || container.innerHTML.trim() === "") {
    if (limparBtn) limparBtn.style.display = "none";
  }

  function updateBadgesTheme(theme) {
    if (!container) return;
    const badges = container.querySelectorAll(".badge");
    badges.forEach(b => {
      // removemos classes de bg que podem existir e aplicamos conforme tema
      b.classList.remove("text-bg-light", "text-bg-dark");
      const classBadge = theme === "dark" ? "text-bg-light" : "text-bg-dark";
      b.classList.add(classBadge);
    });
  }

  document.querySelectorAll(".categoria").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!container) return;
      if (limparBtn) limparBtn.style.display = "inline-block";
      const cat = btn.getAttribute("data-cat");
      container.innerHTML = "";
      const currentTheme = body.getAttribute("data-bs-theme") || "light";
      const classBadge = currentTheme === "dark" ? "text-bg-light" : "text-bg-dark";

      (habilidades[cat] || []).forEach(skill => {
        const badge = document.createElement("span");
        badge.className = `badge ${classBadge} rounded-pill p-3`;
        badge.textContent = skill;
        badge.style.margin = "4px";
        container.appendChild(badge);
      });
    });
  });

  if (limparBtn) {
    limparBtn.addEventListener("click", () => {
      if (container) container.innerHTML = "";
      limparBtn.style.display = "none";
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      alert("Mensagem enviada com sucesso!");

      if (mensagemConfirmacao) {
        mensagemConfirmacao.classList.remove("d-none");
      }

      form.reset();

      if (mensagemConfirmacao) {
        setTimeout(() => {
          mensagemConfirmacao.classList.add("d-none");
        }, 4000);
      }
    });
  } else {
  }

  const anoEl = document.getElementById("anoAtual");
  if (anoEl) anoEl.textContent = new Date().getFullYear();

}); 