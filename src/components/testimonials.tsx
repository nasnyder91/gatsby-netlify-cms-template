import React from "react";
import { v4 } from "uuid";
import Testimonial from "../interfaces/testimonial";

interface TestimonialsProps {
    testimonials: Array<Testimonial>;
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => (
    <div>
        {testimonials.map((testimonial) => (
            <article key={v4()} className="message">
                <div className="message-body">
                    {testimonial.quote}
                    <br />
                    <cite> – {testimonial.author}</cite>
                </div>
            </article>
        ))}
    </div>
);

export default Testimonials;
