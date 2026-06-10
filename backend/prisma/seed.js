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
      nome: 'Final da Copa 2026',
      dtInicio: new Date('2026-06-01T00:00:00.000Z'),
      dtFim: new Date('2026-07-19T23:59:59.000Z'),
      taxaOperacional: 5.0,
      valorBolao: 50.0,
      codigoCampanha: 'COPA2026-FINAL',
      status: 'ABERTA',
      tipoCampanhaId: tipoCopa.id,
    },
  });

  const campanhaEncerrada = await prisma.campanha.create({
    data: {
      nome: 'Semifinal Encerrada',
      dtInicio: new Date('2026-05-01T00:00:00.000Z'),
      dtFim: new Date('2026-05-31T23:59:59.000Z'),
      taxaOperacional: 3.0,
      valorBolao: 30.0,
      codigoCampanha: 'COPA2026-SEMI',
      status: 'ENCERRADA',
      tipoCampanhaId: tipoEliminatorias.id,
    },
  });

  const opcaoBrasil = await prisma.campanhaOpcao.create({
    data: {
      descricao: 'Brasil campeão',
      campanhaId: campanhaFinal.id,
      status: 'ATIVO',
    },
  });

  const opcaoArgentina = await prisma.campanhaOpcao.create({
    data: {
      descricao: 'Argentina campeã',
      campanhaId: campanhaFinal.id,
      status: 'ATIVO',
    },
  });

  const opcaoFranca = await prisma.campanhaOpcao.create({
    data: {
      descricao: 'França campeã',
      campanhaId: campanhaFinal.id,
      status: 'ATIVO',
    },
  });

  await prisma.campanhaOpcao.create({
    data: {
      descricao: 'Alemanha vence',
      campanhaId: campanhaEncerrada.id,
      status: 'ATIVO',
    },
  });

  await prisma.aposta.create({
    data: {
      usuarioId: usuario.id,
      campanhaOpcaoId: opcaoBrasil.id,
      meioPagamentoId: pix.id,
      comprovante: 'comprovante-demo-001',
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
