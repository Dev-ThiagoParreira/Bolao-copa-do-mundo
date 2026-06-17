import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.aposta.deleteMany();
  await prisma.campanhaOpcao.deleteMany();
  await prisma.campanha.deleteMany();
  await prisma.meioPagamento.deleteMany();
  await prisma.tipoCampanha.deleteMany();
  await prisma.usuario.deleteMany();

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('usuario123', 10);

  const admin = await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      cpf: '11111111111',
      email: 'admin@bolao.com',
      telefone: '11999990000',
      senha: adminPassword,
      tipoUsuario: 'ADMIN',
      status: 'ATIVO',
    },
  });

  const usuario = await prisma.usuario.create({
    data: {
      nome: 'João Silva',
      cpf: '22222222222',
      email: 'joao@bolao.com',
      telefone: '11988887777',
      senha: userPassword,
      tipoUsuario: 'USUARIO',
      status: 'ATIVO',
    },
  });

  const tipoCopa = await prisma.tipoCampanha.create({
    data: {
      descricao: 'Copa do Mundo',
      status: 'ATIVO',
    },
  });

  const tipoEliminatorias = await prisma.tipoCampanha.create({
    data: {
      descricao: 'Eliminatórias',
      status: 'ATIVO',
    },
  });

  const COMPROVANTE_DEMO_BASE64 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC';

  const pix = await prisma.meioPagamento.create({
    data: {
      descricao: 'PIX',
      status: 'ATIVO',
      comprovanteObrigatorio: true,
    },
  });

  const cartao = await prisma.meioPagamento.create({
    data: {
      descricao: 'Cartão de Crédito',
      status: 'ATIVO',
      comprovanteObrigatorio: false,
    },
  });

  const campanhaFinal = await prisma.campanha.create({
    data: {
      nome: 'Brasil x Argentina',
      timeA: 'Brasil',
      timeB: 'Argentina',
      dtInicio: new Date('2026-06-01T00:00:00.000Z'),
      dtFim: new Date('2026-07-19T23:59:59.000Z'),
      taxaOperacional: 5.0,
      valorBolao: 50.0,
      codigoCampanha: 'COPA-BRA-ARG',
      status: 'ABERTA',
      tipoCampanhaId: tipoCopa.id,
    },
  });

  const campanhaEncerrada = await prisma.campanha.create({
    data: {
      nome: 'Alemanha x França',
      timeA: 'Alemanha',
      timeB: 'França',
      dtInicio: new Date('2026-05-01T00:00:00.000Z'),
      dtFim: new Date('2026-05-31T23:59:59.000Z'),
      taxaOperacional: 3.0,
      valorBolao: 30.0,
      codigoCampanha: 'COPA-ALE-FRA',
      status: 'ENCERRADA',
      tipoCampanhaId: tipoEliminatorias.id,
    },
  });

  const opcaoBrasil = await prisma.campanhaOpcao.create({
    data: {
      descricao: 'Vitória Brasil',
      tipoResultado: 'VITORIA_TIME_A',
      campanhaId: campanhaFinal.id,
      status: 'ATIVO',
    },
  });

  await prisma.campanhaOpcao.create({
    data: {
      descricao: 'Empate',
      tipoResultado: 'EMPATE',
      campanhaId: campanhaFinal.id,
      status: 'ATIVO',
    },
  });

  const opcaoArgentina = await prisma.campanhaOpcao.create({
    data: {
      descricao: 'Vitória Argentina',
      tipoResultado: 'VITORIA_TIME_B',
      campanhaId: campanhaFinal.id,
      status: 'ATIVO',
    },
  });

  await prisma.campanhaOpcao.create({
    data: {
      descricao: 'Vitória Alemanha',
      tipoResultado: 'VITORIA_TIME_A',
      campanhaId: campanhaEncerrada.id,
      status: 'ATIVO',
    },
  });

  await prisma.campanhaOpcao.create({
    data: {
      descricao: 'Empate',
      tipoResultado: 'EMPATE',
      campanhaId: campanhaEncerrada.id,
      status: 'ATIVO',
    },
  });

  await prisma.campanhaOpcao.create({
    data: {
      descricao: 'Vitória França',
      tipoResultado: 'VITORIA_TIME_B',
      campanhaId: campanhaEncerrada.id,
      status: 'ATIVO',
    },
  });

  await prisma.aposta.create({
    data: {
      usuarioId: usuario.id,
      campanhaOpcaoId: opcaoBrasil.id,
      meioPagamentoId: pix.id,
      comprovante: COMPROVANTE_DEMO_BASE64,
      status: 'CONFIRMADA',
    },
  });

  console.log('Seed concluído com sucesso!');
  console.log('Admin: admin@bolao.com / admin123');
  console.log('Usuário: joao@bolao.com / usuario123');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
