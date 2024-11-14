const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function editarEditalTest() {
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

        // Passo 2: Acessa a página de listagem de editais
        await driver.get('http://localhost:3000/editar-edital'); // Ajuste a URL conforme necessário

        // Passo 3: Espera até que o link "Bolsa do Selenium" esteja presente
        let editalLink = await driver.wait(
            until.elementLocated(By.xpath('//li[contains(text(), "Bolsa do Selenium")]//a[contains(text(), "Editar")]')),
            15000 // Aumente o tempo de espera se necessário
        );

        // Clica no link "Editar" dentro do <li> que contém "Bolsa do Selenium"
        await editalLink.click();

        // Aguarda a navegação para a página de edição do edital
        await driver.wait(until.urlContains('/editar-edital'), 10000);

        // Passo 4: Altera a descrição
        let descricaoInput = await driver.findElement(By.name('descricao'));
        await descricaoInput.clear();
        await descricaoInput.sendKeys('Essa descrição foi alterada');

        // Passo 5: Altera a data de início
        const dataInicio = await driver.findElement(By.name('data_inicio_inscricao'));
        await dataInicio.clear();  // Limpa o campo antes de preencher
        await dataInicio.sendKeys('17/11/2024');  // Data de início no formato dd/mm/aaaa

        // Passo 6: Altera a data de fim
        const dataFim = await driver.findElement(By.name('data_fim_inscricao'));
        await dataFim.clear();
        await dataFim.sendKeys('29/11/2024');  // Data de fim no formato dd/mm/aaaa

        // Passo 7: Salva as alterações
        let salvarButton = await driver.findElement(By.xpath('//button[contains(text(), "Salvar alterações")]'));
        await salvarButton.click();

        // Passo 8: Verifica o alerta de sucesso
        await driver.wait(until.alertIsPresent(), 5000); // Espera o alerta aparecer
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();

        // Verifica se o alerta contém a mensagem de sucesso
        if (alertText === 'Edital atualizado com sucesso!') {
            console.log('Teste de Edição de Edital passou!');
        } else {
            console.log('Falha no teste: Mensagem de alerta não foi exibida corretamente.');
        }

        // Aceita o alerta
        await alert.accept();

    } finally {
        // Finaliza o teste fechando o navegador
        await driver.quit();
    }
})();
