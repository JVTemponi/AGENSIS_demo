import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';

interface CheckboxProps {
    id: string;
    checked: boolean;
    onChange: () => void;
}

export function Checkbox({ id, checked, onChange }: CheckboxProps) {
    return (
        <CheckboxPrimitive.Root
            id={id}
            className={clsx(
                'w-5 h-5 rounded bg-gray-100',
                'border',
                checked ? ['bg-orange-400', 'border-orange-400'] : ['bg-gray-100', 'border-black'],
                'focus:ring focus:ring-offset-2 focus:ring-orange-400 focus:ring-offset-gray-100',
            )}
            checked={checked}
            onCheckedChange={onChange}
        >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center">
                <CheckIcon className="text-white" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}
