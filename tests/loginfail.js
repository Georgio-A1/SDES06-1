const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver'); 

(async function loginIncorreto() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Passo 1: Acessar a página de login
    await driver.get('http://localhost:3000/login');

    // Passo 2: Preencher o CPF e senha incorreta
    await driver.findElement(By.id('cpf')).sendKeys('12345678901'); 
    await driver.findElement(By.id('senha')).sendKeys('senhaincorreta'); 

    // Passo 3: Clicar no botão de login
    await driver.findElement(By.xpath('//button[text()="Entrar"]')).click(); // Clica no botão de login

    // Passo 4: Esperar a mensagem de erro aparecer
    await driver.wait(until.elementLocated(By.className('error-message')), 5000); // Espera a mensagem de erro aparecer

    // Passo 5: Verificar se a mensagem de erro está correta
    let errorMessage = await driver.findElement(By.className('error-message')).getText();
    if (errorMessage === 'Credenciais inválidas') {
      console.log('Teste passou: mensagem de erro exibida corretamente.');
    } else {
      console.log('Teste falhou: mensagem de erro não corresponde ao esperado.');
    }
  } catch (error) {
    console.error('Erro ao executar o teste de login incorreto:', error);
  } finally {
    await driver.quit();
  }
})();
