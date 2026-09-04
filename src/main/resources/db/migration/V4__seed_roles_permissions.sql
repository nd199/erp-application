INSERT INTO roles (name, description)
VALUES ('SUPER_ADMIN', 'Full system access'),
       ('ADMIN', 'Administrative access'),
       ('MANAGER', 'Management access'),
       ('EMPLOYEE', 'Standard employee access');

INSERT INTO permissions (name, description)
VALUES ('USER_CREATE', 'Create users'),
       ('USER_READ', 'View users'),
       ('USER_UPDATE', 'Update users'),
       ('USER_DELETE', 'Delete users'),
       ('USER_ACTIVATE', 'Activate users'),
       ('USER_DEACTIVATE', 'Deactivate users'),
       ('USER_LOCK', 'Lock users'),
       ('USER_UNLOCK', 'Unlock users'),
       ('USER_PASSWORD_CHANGE', 'Change user passwords'),
       ('ROLE_READ', 'View roles'),
       ('ROLE_ASSIGN', 'Assign roles to users'),
       ('ROLE_REMOVE', 'Remove roles from users'),
       ('PERMISSION_READ', 'View permissions'),
       ('PERMISSION_ASSIGN', 'Assign permissions to roles'),
       ('PERMISSION_REMOVE', 'Remove permissions from roles');