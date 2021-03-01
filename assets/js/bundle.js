
(() => {
  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
      initialize()
    }
  }

  const initialize = () => {
    const selector = selector => document.querySelector(selector)
    const create = element => document.createElement(element)

    const app = selector('#app')
    const Login = create('div')

    Login.classList.add('login')

    const Logo = create('img')
    Logo.src = './assets/images/logo.svg'
    Logo.classList.add('logo')

    const Form = create('form')
    Form.classList.add('container-login')

    Form.onsubmit = async e => {
      e.preventDefault()
      const [email, password] = e.target
      const { url } = await fakeAuthenticate(email.value, password.value)
      location.href = '#users'
      const users = await getDevelopersList(url)
      renderPageUsers(users)
    }

    Form.oninput = e => {
      const [email, password, button] = e.target.parentElement.children
      if ((!email.validity.valid || !email.value || password.value.length <= 5)) {
        button.setAttribute('disabled', 'disabled')
      } else {
        button.removeAttribute('disabled')
      }
    }

    Form.innerHTML = `
      <input id="email" type="email" placeholder="Entre com seu e-mail" name="email" required />
      <input id="password" type="password" placeholder="Digite sua senha supersegreta" required name="password"/>
      <button disabled id="btn-submit" type="submit">Entrar</button>
    `
    /**
    * bloco de código omitido
    * monte o seu formulário
    */
    Login.appendChild(Logo)
    Login.appendChild(Form)
    app.appendChild(Login)

    async function fakeAuthenticate(email, password) {
      /**
       * bloco de código omitido
       * aqui esperamos que você faça a requisição ao URL informado
       */
      let data = {}
      try {
        const body = await fetch('http://www.mocky.io/v2/5dba690e3000008c00028eb6')
        data = await body.json()
        data['fakeJwtToken'] = `${btoa(email + password)}.${btoa(data.url)}.${(new Date()).getTime() + 300000}`
        localStorage.setItem('token', JSON.stringify(data['fakeJwtToken']))
      } catch (e) {
        console.log(e)
        alert('Error ao fazer login')
      }
      /* trecho omitido */
      return data
    }

    async function getDevelopersList(url) {
      /**
       * bloco de código omitido
       * aqui esperamos que você faça a segunda requisição 
       * para carregar a lista de desenvolvedores
       */
      let data = []
      try {
        const body = await fetch(url)
        const response = await body.json()
        data = response
      } catch (e) {
        console.error(e)
        alert('Erro ao carregar a lista de desenvolvedores.')
      }
      app.removeChild(Login)
      return data
    }

    function renderPageUsers(users) {
      app.classList.add('logged')
      Login.style.display = 'none' /* trecho omitido */

      const DivLogo = create('div')
      const Logo = create('img')
      Logo.src = './assets/images/logo.svg'
      DivLogo.classList.add('logo')

      const Ul = create('ul')
      Ul.classList.add('container')
      DivLogo.appendChild(Logo)
      Ul.appendChild(DivLogo)
      /**
       * bloco de código omitido
       * exiba a lista de desenvolvedores
       */
      if (Array.isArray(users)) {
        users.forEach(value => {
          Ul.innerHTML += `
            <li>
              <p title="${value.node_id}">
                <img classs="avatar" src="${value.avatar_url}" />
                <span>${value.node_id}</span>
              </p>
            </li>
          `
        })
      }
      app.appendChild(Ul)
    }

    // init
    (async function () {
      const rawToken = localStorage.getItem('token') /* trecho omitido */
      const token = rawToken ? rawToken.split('.') : null
      if (!token || (parseInt(token[2]) < (new Date()).getTime())) {
        localStorage.removeItem('token')
        location.href = '#login'
        app.appendChild(Login)
      } else {
        location.href = '#users'
        const users = await getDevelopersList(atob(token[1]))
        renderPageUsers(users)
      }
    })()
  }
})()