-- CreateTable
CREATE TABLE `Ediciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NULL,
    `fecha` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ediciones` ADD CONSTRAINT `Ediciones_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
