interface Props {
	textContent: string[][];
	inputRef: React.RefObject<HTMLTextAreaElement | null>;
	textContentRef: React.RefObject<HTMLDivElement | null>;
	cursorRef: React.RefObject<HTMLSpanElement | null>;
	handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextContent = ({
	textContent,
	inputRef,
	textContentRef,
	cursorRef,
	handleInput,
}: Props) => {
	return (
		<div className='bg-accent border-2 rounded-xl mb-8 text-3xl leading-[1.8] relative p-6 flex items-center'>
			<span
				className='absolute top-6 bg-none left-4 h-[1.2em] animate-caret-blink transition-all duration-50 ease-linear'
				ref={cursorRef}
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
	);
};

export default TextContent;
