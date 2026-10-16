CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    membership_plan VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO members (full_name, phone, membership_plan) VALUES
('Nguyen Van A', '0981234567', 'VIP 12 Thang'),
('Tran Thi B', '0979876543', 'Goi Co Ban 3 Thang');