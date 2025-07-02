import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Interface() {
  return (
    <main>
        {/* Output Section */}
        <section>
            
        </section>


        {/* Prompting Section */}
        <section className="prompt-input flex mx-auto gap-10 max-w-2xl">
            <Input placeholder="Type your prompt here..." />
            <Button className="px-6">Enter</Button>
        </section>
    </main>
  );
}

export default Interface;
