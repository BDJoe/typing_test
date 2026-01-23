import Loading from "./loading";

interface Props {
	textContent: string[][];
	inputRef: React.RefObject<HTMLTextAreaElement | null>;
	textContentRef: React.RefObject<HTMLDivElement | null>;
	cursorRef: React.RefObject<HTMLSpanElement | null>;
	cursorX: number;
	cursorY: number;
	handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	isLoading: boolean;
}

const TextContent = ({
	textContent,
	inputRef,
	textContentRef,
	cursorRef,
	cursorX,
	cursorY,
	handleInput,
	isLoading,
}: Props) => {
	return (
		<div className='mb-8 text-3xl leading-[1.8] relative p-6 flex items-center'>
			{isLoading && <Loading className='w-full max-h-[5.4em]' />}
			{!isLoading && (
				<div>
					<span
						ref={cursorRef}
						className='absolute pointer-events-none font-bold text-primary transition-all caret-normal ease-out'
						style={{
							left: `${cursorX}px`,
							top: `${cursorY}px`,
							animation: "caret-blink 1s ease-in-out infinite",
							transform: "translate(16px, 18px)",
						}}
					>
						|
					</span>
					<div
						className='w-full max-h-[5.4em] overflow-hidden'
						ref={textContentRef}
					>
						{textContent.map((char, index) => (
							<span key={index} className={char[1]}>
								{char[0]}
							</span>
						))}
					</div>
					<textarea
						name='text-input'
						className='fixed w-1 h-1 left-0 top-0 opacity-0 pointer-events-none'
						ref={inputRef}
						autoFocus
						autoComplete='off'
						spellCheck='false'
						onChange={handleInput}
						onKeyDown={(e) => {
							if (e.ctrlKey && e.key === "z") {
								e.preventDefault();
								console.log("Undo is disabled");
							}
						}}
						onCopy={(e) => {
							e.preventDefault();
							return false;
						}}
						onPaste={(e) => {
							e.preventDefault();
							return false;
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default TextContent;
