async function enviarCpf() {
    const cpf = document.getElementById('cpf').value;
    const saida = document.getElementById('saida2');

    const response = await fetch(`http://127.0.0.1:5000/consulta?doc=${cpf}`);

    if (response.ok) {
        const dados = await response.json();
        console.log(dados);

        if (dados.message === 'Registro não encontrado') {
            saida.innerHTML = 'Cliente não encontrado';
        } else {
            saida.innerHTML = `
                Nome: ${dados.nome} <br>
                Data de Nascimento: ${dados.data_nascimento} <br>
                Email: ${dados.email} <br>
            `;
        }
    }
}

async function cadastrarCliente() {
    // pegando os valores digitados lá no HTML
    const cpf = document.getElementById('cad-cpf').value;
    const nome = document.getElementById('cad-nome').value;
    const data_nascimento = document.getElementById('cad-nascimento').value;
    const email = document.getElementById('cad-email').value;
    const saidaCadastro = document.getElementById('saidacadastro'); // Exibe mensagem de erro/sucesso do cadastro

    // vericando se o cpf existe antes de salvar
    const consultaResponse = await fetch(`http://127.0.0.1:5000/consulta?doc=${cpf}`);

    if (consultaResponse.ok) {
        const consultaDados = await consultaResponse.json();

        if (consultaDados.message === 'Registro não encontrado') {
            // Se o CPF não foi encontrado, prosseguir com o cadastro
            const payload = {
                cpf,
                dados: {
                    nome,
                    data_nascimento,
                    email
                }
            };

            // Faz a requisição POST para o backend para cadastrar o cliente
            try {
                const cadastroResponse = await fetch('http://127.0.0.1:5000/cadastro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (cadastroResponse.ok) {
                    // Resposta do backend
                    const cadastroResultado = await cadastroResponse.text();
                    saidaCadastro.innerHTML = cadastroResultado;
                } else {
                    // Se o backend retornar erro (status diferente de 200)
                    const erro = await cadastroResponse.text();
                    saidaCadastro.innerHTML = `Erro: ${erro}`;
                }
            } catch (error) {
                saidaCadastro.innerHTML = `Erro ao tentar cadastrar: ${error.message}`;
            }
        } else {
            // Se o CPF já existir, não permita o cadastro
            saidaCadastro.innerHTML = 'CPF já cadastrado.';
        }
    } else {
        saidaCadastro.innerHTML = 'Erro ao verificar CPF. Tente novamente.';
    }
}
