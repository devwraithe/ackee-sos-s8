export default function ProfileCardTwo({ title, value }: { title: string, value: any }) {
    return (
        <div className="p-4 px-5 mt-3 lg:mt-6 bg-neutral-800 rounded-lg">
            <div className="text-sm text-neutral-400 mb-2">{title}</div>
            <div className="text-md break-words">{value}</div>
        </div>
    );
}