import { ProseArticle as ProseArticleComponent } from "@voila.dev/ui/landing";

export function ProseArticle() {
	return (
		<ProseArticleComponent>
			<h2>Why every launch deserves a dedicated freelancer</h2>
			<p>
				Every week, thousands of product launches ship without any dedicated
				support. Yet having an <strong>independent expert</strong> alongside the
				team changes everything.
			</p>
			<blockquote>
				<p>
					Working with a dedicated freelancer through the quarter changed
					everything: fewer reworks, and the feeling of finally shipping on
					time.
				</p>
			</blockquote>
			<h3>What good delivery looks like</h3>
			<ul>
				<li>Scoping the work before the sprint</li>
				<li>Hands-on support during the build</li>
				<li>Follow-up and continuity after the launch</li>
			</ul>
		</ProseArticleComponent>
	);
}
