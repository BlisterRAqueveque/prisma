-- AlterTable
ALTER TABLE `ediciones` ADD COLUMN `usuarioEditorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Ediciones` ADD CONSTRAINT `Ediciones_usuarioEditorId_fkey` FOREIGN KEY (`usuarioEditorId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
