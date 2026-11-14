import { Input } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function SearchInput({
    value,
    onChange,
    placeholder,
    disabled = false,
}: SearchInputProps) {
    return (
        <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            prefix={<SearchOutlined style={{ fontSize: 16 }} />}
            suffix={
                value && !disabled ? (
                    <CloseOutlined
                        style={{ fontSize: 16, cursor: 'pointer' }}
                        onClick={() => onChange('')}
                    />
                ) : null
            }
            style={{
                width: '100%',
                backgroundColor: 'var(--ant-color-gray-1)',   // approximates Mantine's gray-0
                textAlign: 'right',
                padding: '0px 20px',
                height:"50px"
            }}
        />
    );
}
