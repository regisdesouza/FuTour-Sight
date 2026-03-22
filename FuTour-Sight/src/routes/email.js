const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

router.patch('/usuarios/:id/aprovar', async (req, res) => {
  try {
    const { id } = req.params;

    // Mocado temporário até a conexao com o banco ficar pronta
    const usuario = {
      email: 'lucas.teodoro@gmail.com',
      status: 'PENDENTE',
      update: async () => {},
    };

    const token = crypto.randomBytes(8).toString('hex');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"FuTour Sight" <${process.env.EMAIL_USER}>`,
      to: usuario.email,
      subject: 'Sua conta foi aprovada!',
      html: `
        <h2>Bem-vindo ao FuTour Sight!</h2>
        <p>Sua conta foi aprovada. Use as credenciais abaixo para acessar o sistema:</p>
        <p><strong>Login:</strong> ${usuario.email}</p>
        <p><strong>Senha temporária:</strong> ${token}</p>
        <p>Ao realizar o primeiro acesso, você será redirecionado para completar seu cadastro.</p>
      `,
    });

    res.json({ mensagem: 'Email enviado!', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao enviar email' });
  }
});

module.exports = router;