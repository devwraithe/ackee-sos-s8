export default function FeatureCard({ icon, title, value }: { icon: string, title: string, value: string }) {
    return (
        <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-white font-semibold mb-1">{title}</div>
            <div className="text-sm text-neutral-500">{value}</div>
        </div>
    );
}