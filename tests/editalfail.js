const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function criarEditalTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Passo 1: Acessa a página de login
        await driver.get('http://localhost:3000/login'); 
        
        // Encontra os campos de CPF e senha e insire as credenciais
        await driver.findElement(By.id('cpf')).sendKeys('56789012345'); 
        await driver.findElement(By.id('senha')).sendKeys('admin123'); 
        
        // Clica no botão de login
        await driver.findElement(By.css('button[type="submit"]')).click();
        
        // Aguarda o redirecionamento para o dashboard
        await driver.wait(until.urlContains('/dashboard'), 10000);

        // Passo 2: Aguarde o botão de "Criar Edital" ficar visível
        await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Criar Edital')]")), 10000);  // Aguarda o botão ser carregado
        await driver.findElement(By.xpath("//button[contains(text(),'Criar Edital')]")).click();
        
        // Passo 3: Preencher o formulário de criação de edital
        await driver.findElement(By.name('nome_bolsa')).sendKeys('Bolsa do Selenium');
        await driver.findElement(By.name('descricao')).sendKeys('Bolsa criada pelo teste do selenium');
        await driver.findElement(By.name('criterios_elegibilidade')).sendKeys('Ser aluno');
        await driver.findElement(By.name('periodo_letivo')).sendKeys('2024');
        await driver.findElement(By.name('data_inicio_inscricao')).sendKeys('2024-11-15');
        await driver.findElement(By.name('data_fim_inscricao')).sendKeys('2024-10-30');  // Data de fim antes da data de início
        await driver.findElement(By.name('maximo_alunos_aprovados')).sendKeys('25');

        // Passo 4: Clique no botão de "Criar Edital"
        await driver.findElement(By.xpath("//button[contains(text(),'Criar Edital')]")).click();

        // Passo 5: Verifica se o alerta de erro aparece (data de fim anterior à data de início)
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        
        if (alertText === 'A data de fim da inscrição não pode ser anterior à data de início.') {
            console.log("Teste de criação de edital falhou como esperado: " + alertText);
        } else {
            console.log("Falha no teste: Alerta não apareceu ou foi diferente.");
        }

        // Aceitar o alerta
        await alert.accept();

    } finally {
        // Encerra o driver após o teste
        await driver.quit();
    }
})();
