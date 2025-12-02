export default function ProfileCard({ title, value }: { title: string, value: any }) {
    return (
        <div>
            <div className="p-4 px-5 bg-neutral-800 rounded-lg">
                <div className="text-sm text-neutral-400 mb-2">{title}</div>
                <div className="text-lg lg:text-xl font-bold">{value}</div>
            </div>
        </div>
    );
}