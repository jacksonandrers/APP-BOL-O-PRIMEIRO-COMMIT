
import React, { useState } from 'react';
import { db } from '../db';
import { User, UserRole } from '../types';
import { Phone } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering && (!whatsapp || whatsapp.length < 8)) {
      setError('Por favor, insira um número de WhatsApp válido.');
      return;
    }

    const users = db.getUsers();

    if (isRegistering) {
      if (users.some(u => u.email === email)) {
        setError('E-mail já cadastrado.');
        return;
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email,
        whatsapp,
        password,
        role: email.includes('admin') ? UserRole.ADMIN : UserRole.USER,
        balance: 0,
        withdrawableBalance: 0,
        createdAt: Date.now()
      };
      
      db.saveUser(newUser);
      db.setCurrentUser(newUser);
      onLogin(newUser);
    } else {
      // Login Admin Hardcoded
      if (email === 'admin@bolao.com') {
        let admin = users.find(u => u.email === 'admin@bolao.com');
        if (!admin) {
          admin = {
            id: 'admin-master',
            name: 'Administrador Master',
            email: 'admin@bolao.com',
            whatsapp: '(00) 00000-0000',
            password: 'admin',
            role: UserRole.ADMIN,
            balance: 0,
            withdrawableBalance: 0,
            createdAt: Date.now()
          };
          db.saveUser(admin);
        }
        db.setCurrentUser(admin);
        onLogin(admin);
        return;
      }

      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        db.setCurrentUser(user);
        onLogin(user);
      } else {
        setError('E-mail ou senha incorretos.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#10B981] mb-2 tracking-tighter italic uppercase">BOLÃO APP</h1>
          <p className="text-[#FAFAFA]/40 font-bold uppercase tracking-widest text-[10px]">Gestão Premium de Apostas</p>
        </div>

        <div className="bg-[#141417] border border-[#27272A] rounded-3xl p-8 md:p-10 shadow-2xl">
          <h2 className="text-2xl font-black mb-8 italic uppercase tracking-tight text-white">
            {isRegistering ? 'Criar Nova Conta' : 'Acesse sua Conta'}
          </h2>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {isRegistering && (
              <>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-[#FAFAFA]/40">Nome Completo</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-xl px-5 py-3.5 font-bold text-white outline-none focus:border-[#10B981] transition-all" 
                    placeholder="Seu nome"
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-[#10B981]">WhatsApp (Obrigatório)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="(00) 00000-0000" 
                      value={whatsapp} 
                      onChange={(e) => setWhatsapp(e.target.value)} 
                      className="w-full bg-[#0A0A0B] border border-[#10B981]/30 rounded-xl pl-12 pr-5 py-3.5 font-bold text-white outline-none focus:border-[#10B981] transition-all" 
                      required 
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10B981]/50" />
                  </div>
                </div>
              </>
            )}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase text-[#FAFAFA]/40">E-mail</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-xl px-5 py-3.5 font-bold text-white outline-none focus:border-[#10B981] transition-all" 
                placeholder="seu@email.com"
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase text-[#FAFAFA]/40">Senha</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-xl px-5 py-3.5 font-bold text-white outline-none focus:border-[#10B981] transition-all" 
                placeholder="••••••••"
                required 
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                <p className="text-red-400 text-[10px] font-black uppercase text-center">
                  {error}
                </p>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-[#10B981] text-black font-black py-4.5 rounded-xl hover:bg-[#0ea372] transition-all shadow-xl shadow-[#10B981]/10 mt-4 uppercase italic tracking-tighter active:scale-95"
            >
              {isRegistering ? 'CADASTRAR E ENTRAR' : 'ENTRAR NO APP'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#27272A] text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)} 
              className="text-[10px] font-black text-[#FAFAFA]/30 uppercase hover:text-[#10B981] transition-colors tracking-widest"
            >
              {isRegistering ? 'Já tem uma conta? Faça Login' : 'Ainda não tem conta? Cadastre-se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
