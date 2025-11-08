import React from 'react';
import { FiHome, FiUsers, FiPackage, FiTool, FiRepeat, FiRadio, FiGithub, FiLinkedin, FiGlobe, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
    const navigationLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: <FiHome className="w-4 h-4" /> },
        { path: '/users', label: 'Usuários', icon: <FiUsers className="w-4 h-4" /> },
        { path: '/item-models', label: 'Modelos', icon: <FiPackage className="w-4 h-4" /> },
        { path: '/items', label: 'Itens', icon: <FiTool className="w-4 h-4" /> },
        { path: '/transactions', label: 'Transações', icon: <FiRepeat className="w-4 h-4" /> },
        { path: '/rfid-pendings', label: 'RFIDs Pendentes', icon: <FiRadio className="w-4 h-4" /> },
    ];

    const socialLinks = [
        {
            href: 'https://otaviovinicius-portfolio.vercel.app/',
            icon: <FiGlobe className="w-5 h-5" />,
            label: 'Portfolio'
        },
        {
            href: 'https://www.linkedin.com/in/otavioviniciusflauzino/',
            icon: <FiLinkedin className="w-5 h-5" />,
            label: 'LinkedIn'
        },
        {
            href: 'https://github.com/TavinV',
            icon: <FiGithub className="w-5 h-5" />,
            label: 'GitHub'
        }
    ];

    return (
        <footer className="w-full bg-gray-900 text-gray-300 border-t border-gray-700 mt-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Coluna 1: Logo e descrição */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">
                            Sistema de Gestão
                        </h3>
                        <p className="text-sm text-gray-400 max-w-xs">
                            Sistema profissional para gestão de inventário e controle de ativos.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.href}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors duration-200"
                                    title={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Coluna 2: Navegação */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                            Navegação
                        </h3>
                        <nav className="grid grid-cols-1 gap-2">
                            {navigationLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 py-1"
                                >
                                    {link.icon}
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Coluna 3: Contato e desenvolvedor */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                            Contato
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-2">
                                <FiMail className="w-4 h-4 mt-1 text-gray-400" />
                                <div>
                                    <a
                                        href="https://otaviovinicius-portfolio.vercel.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-white hover:text-blue-400 transition-colors duration-200"
                                    >
                                        Otávio Vinícius
                                    </a>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-4">
                                Precisa de um sistema similar? Entre em contato para discutir seu projeto.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-6 border-t border-gray-700">
                    <p className="text-xs text-gray-400 text-center">
                        © {new Date().getFullYear()} Sistema de Gestão de Inventário. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;