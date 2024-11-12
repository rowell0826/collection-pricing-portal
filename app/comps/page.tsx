import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Comps = () => {
	return (
		<div className="flex">
			<div className="flex-1">Container</div>
			<Tabs className="w-1/5 h-screen p-4 border-l border-gray-200">
				<TabsList>
					<TabsTrigger value="artwork">Artwork</TabsTrigger>
					<TabsTrigger value="comparables">Comparables</TabsTrigger>
				</TabsList>
				<TabsContent value="artwork"></TabsContent>
				<TabsContent value="comparables"></TabsContent>
			</Tabs>
		</div>
	);
};

export default Comps;
