CREATE DATABASE IF NOT EXISTS artespro;

use artespro;

CREATE TABLE IF NOT EXISTS `tb_usuario` (
    `id` int NOT NULL AUTO_INCREMENT,
    `email` varchar(244) NOT NULL,
    `senha` varchar(244) NOT NULL,
    `status` enum('1', '2', '3') DEFAULT '1',
    `data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
    `perfil` enum('admin', 'cliente') NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
);

CREATE TABLE IF NOT EXISTS `tb_servico` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(100) NOT NULL,
    `descricao` varchar(255) NOT NULL,
    `duracao_media` int  NOT NULL,
    `unidade_duracao` enum('Horas', 'Dias', 'Semanas', 'Meses'),
    `preco_medio` float  NOT NULL,
    `disponibilidade` boolean DEFAULT true,
    PRIMARY KEY (`id`)
);

