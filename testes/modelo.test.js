const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando retorno de perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');

  const perguntas = modelo.listar_perguntas();

  const id1 = perguntas[0].id_pergunta;
  const id2 = perguntas[1].id_pergunta;
  const id3 = perguntas[2].id_pergunta;

  const pergunta1 = modelo.get_pergunta(id1);
  const pergunta2 = modelo.get_pergunta(id2);
  const pergunta3 = modelo.get_pergunta(id3);

  expect(pergunta1.texto).toBe('1 + 1 = ?');
  expect(pergunta2.texto).toBe('2 + 2 = ?');
  expect(pergunta3.texto).toBe('3 + 3 = ?');
});

test('Testando sistema de respostas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  const perguntas = modelo.listar_perguntas();
  const id1 = perguntas[0].id_pergunta;

  modelo.cadastrar_resposta(id1, 'Eh tres');
  modelo.cadastrar_resposta(id1, 'Não, eh dois');

  const respostas = modelo.get_respostas(id1);

  expect(modelo.get_num_respostas(id1)).toBe(2);
  expect(respostas[0].texto).toBe('Eh tres')
  expect(respostas[1].texto).toBe('Não, eh dois')
});

