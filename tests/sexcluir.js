const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function excluirEditalTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Passo 1: Realiza o login como admin
        await driver.get('http://localhost:3000/login'); // Ajuste a URL conforme necessário

        // Efetua login
        await driver.findElement(By.id('cpf')).sendKeys('56789012345');
        await driver.findElement(By.id('senha')).sendKeys('admin123');
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Aguarda a navegação para a página inicial
        await driver.wait(until.urlContains('/dashboard'), 10000);

        // Passo 2: Acessa a página de exclusão de editais
        await driver.get('http://localhost:3000/excluir-edital'); // Ajuste a URL conforme necessário

        // Passo 3: Espera até que o nome do edital "Bolsa do Selenium" esteja visível
        let editalToExcluir = await driver.wait(
            until.elementLocated(By.xpath('//li[span[contains(text(), "Bolsa do Selenium")]]')),
            10000
        );

        // Passo 4: Clica no botão de excluir correspondente ao edital "Bolsa do Selenium"
        let excluirButton = await editalToExcluir.findElement(By.xpath('.//button[contains(text(), "Excluir")]'));
        await excluirButton.click();

        // Passo 5: Espera e aceita o primeiro alerta (confirmação de exclusão)
        await driver.wait(until.alertIsPresent(), 5000); // Espera o alerta aparecer
        let confirmAlert = await driver.switchTo().alert();
        await confirmAlert.accept(); // Clica no OK para confirmar a exclusão

        // Passo 6: Espera o segundo alerta com a mensagem de sucesso
        await driver.wait(until.alertIsPresent(), 5000); // Espera o alerta de sucesso aparecer
        let successAlert = await driver.switchTo().alert();
        let alertText = await successAlert.getText();

        // Passo 7: Verifica se o alerta contém a mensagem "Edital excluído com sucesso!"
        if (alertText === 'Edital excluído com sucesso!') {
            console.log('Teste de Exclusão de Edital passou!');
        } else {
            console.log('Falha no teste: Mensagem de alerta não foi exibida corretamente.');
        }

        // Aceita o alerta de sucesso
        await successAlert.accept();

    } finally {
        // Finaliza o teste fechando o navegador
        await driver.quit();
    }
})();
