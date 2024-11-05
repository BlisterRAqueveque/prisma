-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `disponible` BOOLEAN NULL DEFAULT true;

-- CreateIndex
CREATE INDEX `Usuario_disponible_idx` ON `Usuario`(`disponible`);
