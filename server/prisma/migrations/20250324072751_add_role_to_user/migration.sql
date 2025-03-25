-- AlterTable
ALTER TABLE `users` ADD COLUMN `role_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL DEFAULT 10,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
