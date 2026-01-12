import { useState, useEffect } from 'react';

function App() {
	const [tickets, setTickets] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [newTitle, setNewTitle] = useState('');
	const [newDescription, setNewDescription] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Load tickets on mount
	useEffect(() => {
		loadTickets();
		checkLoginStatus();
	}, []);

	const checkLoginStatus = async () => {
		try {
			const response = await fetch('/api/check-session.php');
			const data = await response.json();
			setIsLoggedIn(data.logged_in);
		} catch (error) {
			console.error('Error checking login status:', error);
		}
	};

	const loadTickets = async () => {
		try {
			const response = await fetch('/api/tickets.php');
			const data = await response.json();
			setTickets(data);
		} catch (error) {
			console.error('Error loading tickets:', error);
		}
	};

	const addTicket = async (e) => {
		e.preventDefault();
		
		try {
			const response = await fetch('/api/tickets.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					action: 'add',
					title: newTitle,
					description: newDescription,
				}),
			});

			if (response.status === 403) {
				setErrorMessage('Pro přidání tiketů se musíte přihlásit.');
				return;
			}

			const data = await response.json();
			setTickets(data);
			setNewTitle('');
			setNewDescription('');
			setShowForm(false);
		} catch (error) {
			console.error('Error adding ticket:', error);
		}
	};

	const removeTicket = async (id) => {
		try {
			const response = await fetch('/api/tickets.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					action: 'delete',
					id: id,
				}),
			});

			const data = await response.json();
			setTickets(data);
		} catch (error) {
			console.error('Error removing ticket:', error);
		}
	};

	const handleLogout = async () => {
		try {
			await fetch('/api/login.php?logout=true');
			setIsLoggedIn(false);
			window.location.href = '/api/login.php';
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-center">
				<div className="w-full max-w-2xl">
					{isLoggedIn ? (
						<div className="flex items-center gap-3 mb-6">
							<img
								src="https://avatar.iran.liara.run/public/boy"
								alt="Admin"
								width="30"
								height="30"
								className="rounded-full"
							/>
							<p className="text-gray-700">
								Welcome, Admin! <button onClick={handleLogout} className="text-blue-600 hover:text-blue-800 underline">Logout</button>
							</p>
						</div>
					) : (
						<p className="mb-6 text-gray-700">
							<a href="/api/login.php" className="text-blue-600 hover:text-blue-800 underline">Login</a> to manage tickets.
						</p>
					)}

					{isLoggedIn && (
						<>
							{!showForm && (
								<button
									onClick={() => setShowForm(true)}
									className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-8"
								>
									Add new ticket
								</button>
							)}

							{showForm && (
								<form onSubmit={addTicket} className="bg-white p-6 rounded-lg shadow-md mb-8">
									<input
										type="text"
										placeholder="Title"
										value={newTitle}
										onChange={(e) => setNewTitle(e.target.value)}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									<textarea
										placeholder="Description"
										value={newDescription}
										onChange={(e) => setNewDescription(e.target.value)}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									<div className="flex gap-3">
										<button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
											Submit
										</button>
										<button
											type="button"
											onClick={() => setShowForm(false)}
											className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
										>
											Cancel
										</button>
									</div>
								</form>
							)}
						</>
					)}

					{errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

					<div className="space-y-4">
						{tickets.map((ticket) => (
							<div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
								<h3 className="text-xl font-bold text-gray-900 mb-2">{ticket.title}</h3>
								<p className="text-gray-700 mb-4">{ticket.description}</p>
								<small className="text-gray-500 text-sm block mb-4">
									Created: {ticket.created} | Last Modified: {ticket.lastModified}
								</small>
								{isLoggedIn && (
									<div className="flex gap-3">
										<a href={`/api/edit_ticket.php?id=${ticket.id}`} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
											Edit
										</a>
										<button
											onClick={() => removeTicket(ticket.id)}
											className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
										>
											Delete
										</button>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
