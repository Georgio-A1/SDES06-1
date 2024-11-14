const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function criarUsuarioTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:3000/login');

        // Efetua login
        await driver.findElement(By.css('input[type="text"]')).sendKeys('56789012345'); // CPF
        await driver.findElement(By.id('senha')).sendKeys('admin123');
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Aguarda até que a URL da página de dashboard seja carregada
        await driver.wait(until.urlContains('/dashboard'), 20000);

        // Espera até que o botão "Cadastrar Usuário" esteja visível
        await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Cadastrar Usuário')]")), 20000);
        await driver.findElement(By.xpath("//button[contains(text(),'Cadastrar Usuário')]")).click();

        // Espera até que o formulário de cadastro esteja visível
        await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(),'Cadastrar Novo Usuário')]")), 20000);

        // Preenche os campos com os valores fornecidos

        // Preenche o campo de "CPF"
        await preencherCampoPorLabel(driver, 'CPF', '12345654321');

        // Preenche o campo de "Email"
        await preencherCampoPorLabel(driver, 'Email', 'seuzezinho@email.com');
        
        // Preenche o campo de "Nome Completo"
        await preencherCampoPorLabel(driver, 'Nome Completo', 'José da Silva Almeida');
        
        // Preenche o campo de "Matrícula"
        await preencherCampoPorLabel(driver, 'Matricula', '202310008');
        
        // Preenche o campo de "Número Celular"
        await preencherCampoPorLabel(driver, 'Número Celular', '11987654332');
        
        // Preenche o campo de "Endereço"
        await preencherCampoPorLabel(driver, 'Endereço', 'Rua das Flores, 129, Centro');

        // Preenche o campo de "Senha"
        await preencherCampoPorLabel(driver, 'Senha', 'senhaselena');

        // Preenche o campo de "Tipo de Usuário"
        await selecionarOpcaoSelectPorLabel(driver, 'Tipo de Usuário', 'Aluno');

        // Clica no botão de cadastrar usuário
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Espera pela mensagem de sucesso do alerta
        await driver.wait(until.alertIsPresent(), 5000);
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();

        if (alertText === 'Usuário cadastrado com sucesso!') {
            console.log('Teste de Cadastro de Usuário passou!');
        } else {
            console.log('Falha no teste: Mensagem de alerta não foi exibida corretamente.');
        }

        await alert.accept();
    } finally {
        await driver.quit();
    }
})();

// Função que preenche o campo input baseado no texto da label
async function preencherCampoPorLabel(driver, labelTexto, valor) {
    // Aguarda até que o elemento label esteja visível
    const label = await driver.wait(until.elementLocated(By.xpath(`//label[contains(text(),'${labelTexto}')]`)), 5000);
    
    // Encontra o input relacionado à label (geralmente o input é o próximo irmão da label ou está dentro de um form com a label)
    const input = await label.findElement(By.xpath('following-sibling::input'));

    // Preenche o campo input com o valor desejado
    await input.sendKeys(valor);
}

// Função que seleciona uma opção de um select baseado no texto da label
async function selecionarOpcaoSelectPorLabel(driver, labelTexto, valor) {
    // Aguarda até que o elemento label esteja visível
    const label = await driver.wait(until.elementLocated(By.xpath(`//label[contains(text(),'${labelTexto}')]`)), 5000);

    // Encontra o select relacionado à label (geralmente o select é o próximo irmão da label)
    const select = await label.findElement(By.xpath('following-sibling::select'));

    // Encontra o option dentro do select com o valor desejado e clica nele
    await select.findElement(By.xpath(`.//option[@value='${valor}']`)).click();
}
