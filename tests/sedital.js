const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function criarEditalTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:3000/login');  // Ajuste a URL conforme necessário

        // Efetua login
        await driver.findElement(By.id('cpf')).sendKeys('56789012345');
        await driver.findElement(By.id('senha')).sendKeys('admin123');
        await driver.findElement(By.css('button[type="submit"]')).click();

        await driver.wait(until.urlContains('/dashboard'), 10000);

        await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Criar Edital')]")), 10000);
        await driver.findElement(By.xpath("//button[contains(text(),'Criar Edital')]")).click();

        // Preencha o formulário de criação de edital
        await driver.findElement(By.name('nome_bolsa')).sendKeys('Bolsa do Selenium');
        await driver.findElement(By.name('descricao')).sendKeys('Bolsa criada pelo teste do selenium');
        await driver.findElement(By.name('criterios_elegibilidade')).sendKeys('Ser aluno');
        await driver.findElement(By.name('periodo_letivo')).sendKeys('2024');
        
        // Pausa para garantir o carregamento dos campos de data
        await driver.sleep(1000);

        // Preenche os campos de data no formato dd/mm/aaaa
        const dataInicio = await driver.findElement(By.name('data_inicio_inscricao'));
        await dataInicio.clear();  // Limpa o campo antes de preencher
        await dataInicio.sendKeys('15/11/2024');  // Data de início no formato dd/mm/aaaa

        const dataFim = await driver.findElement(By.name('data_fim_inscricao'));
        await dataFim.clear();
        await dataFim.sendKeys('30/11/2024');  // Data de fim no formato dd/mm/aaaa
        
        await driver.findElement(By.name('maximo_alunos_aprovados')).sendKeys('25');

        // Localize e clique no botão para adicionar pergunta
        await driver.sleep(1000);
        await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Adicionar Pergunta')]")), 10000);
        await driver.findElement(By.xpath("//button[contains(text(),'Adicionar Pergunta')]")).click();
        
        // Preenche a pergunta
        await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Texto da pergunta']")), 10000);
        await driver.findElement(By.xpath("//input[@placeholder='Texto da pergunta']")).sendKeys('Isso foi criado com selenium?');
        
        await driver.wait(until.elementLocated(By.xpath("//select")), 10000);
        await driver.findElement(By.xpath("//select")).sendKeys('Sim/Não');
        
        await driver.wait(until.elementLocated(By.xpath("//input[@type='checkbox']")), 10000);
        await driver.findElement(By.xpath("//input[@type='checkbox']")).click();

        await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 10000);
        await driver.findElement(By.css('button[type="submit"]')).click();

        await driver.wait(until.alertIsPresent(), 5000);
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();

        if (alertText === 'Edital criado com sucesso!') {
            console.log('Teste de Criação de Edital passou!');
        } else {
            console.log('Falha no teste: Mensagem de alerta não foi exibida corretamente.');
        }
        
        await alert.accept();

    } finally {
        await driver.quit();
    }
})();
