// tests/logintest.js

const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function loginCorretoTest() {
    let driver = await new Builder().forBrowser('chrome').build();
    
    try {
        // Acesse a página de login
        await driver.get('http://localhost:3000/login');  // Ajuste a URL conforme necessário
        
        // Encontre os campos de CPF e senha e insira as credenciais corretas
        await driver.findElement(By.id('cpf')).sendKeys('12345678901');
        await driver.findElement(By.id('senha')).sendKeys('senha123');
        
        // Clique no botão de login
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        // Aguarde o redirecionamento para o dashboard
        await driver.wait(until.urlContains('/dashboard'), 10000);

        // Verifique se a URL foi redirecionada corretamente para o dashboard
        let currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('/dashboard')) {
            console.log('Teste de Login Correto passou!');
        } else {
            console.log('Falha no teste: Redirecionamento para o dashboard não ocorreu.');
        }
    } finally {
        // Encerra o driver após o teste
        await driver.quit();
    }
})();
