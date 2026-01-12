import { useState, useEffect } from 'react';

function App() {
	const [tickets, setTickets] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [newTitle, setNewTitle] = useState('');
	const [newDescription, setNewDescription] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loginError, setLoginError] = useState('');
	const [editingTicket, setEditingTicket] = useState(null);

	// Valid credentials
	const VALID_USERNAME = 'admin';
	const VALID_PASSWORD = 'admin';

	// Load tickets and login status on mount
	useEffect(() => {
		loadTickets();
		checkLoginStatus();
	}, []);

	const checkLoginStatus = () => {
		const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
		setIsLoggedIn(loggedIn);
	};

	const loadTickets = () => {
		const storedTickets = localStorage.getItem('tickets');
		if (storedTickets) {
			setTickets(JSON.parse(storedTickets));
		} else {
			// Initialize with default tickets
			const defaultTickets = [
				{
					id: 1,
					title: 'Welcome Ticket',
					description: 'This is your first ticket. Login to manage tickets.',
					created: new Date().toLocaleString('cs-CZ'),
					lastModified: new Date().toLocaleString('cs-CZ')
				}
			];
			setTickets(defaultTickets);
			localStorage.setItem('tickets', JSON.stringify(defaultTickets));
		}
	};

	const saveTickets = (updatedTickets) => {
		setTickets(updatedTickets);
		localStorage.setItem('tickets', JSON.stringify(updatedTickets));
	};

	const addTicket = (e) => {
		e.preventDefault();
		
		if (!isLoggedIn) {
			setErrorMessage('Pro přidání tiketů se musíte přihlásit.');
			return;
		}

		const newTicket = {
			id: Date.now(),
			title: newTitle,
			description: newDescription,
			created: new Date().toLocaleString('cs-CZ'),
			lastModified: new Date().toLocaleString('cs-CZ')
		};

		const updatedTickets = [...tickets, newTicket];
		saveTickets(updatedTickets);
		setNewTitle('');
		setNewDescription('');
		setShowForm(false);
		setErrorMessage('');
	};

	const updateTicket = (e) => {
		e.preventDefault();
		
		const updatedTickets = tickets.map(ticket => 
			ticket.id === editingTicket.id 
				? { 
					...ticket, 
					title: newTitle, 
					description: newDescription,
					lastModified: new Date().toLocaleString('cs-CZ')
				  }
				: ticket
		);
		
		saveTickets(updatedTickets);
		setNewTitle('');
		setNewDescription('');
		setEditingTicket(null);
		setShowForm(false);
	};

	const removeTicket = (id) => {
		const updatedTickets = tickets.filter(ticket => ticket.id !== id);
		saveTickets(updatedTickets);
	};

	const startEdit = (ticket) => {
		setEditingTicket(ticket);
		setNewTitle(ticket.title);
		setNewDescription(ticket.description);
		setShowForm(true);
	};

	const cancelEdit = () => {
		setEditingTicket(null);
		setNewTitle('');
		setNewDescription('');
		setShowForm(false);
	};

	const handleLogin = (e) => {
		e.preventDefault();
		setLoginError('');

		if (username === VALID_USERNAME && password === VALID_PASSWORD) {
			setIsLoggedIn(true);
			sessionStorage.setItem('isLoggedIn', 'true');
			setShowLogin(false);
			setUsername('');
			setPassword('');
		} else {
			setLoginError('Invalid username or password.');
		}
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
		sessionStorage.removeItem('isLoggedIn');
		setShowForm(false);
		setEditingTicket(null);
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
						<div className="mb-6">
							{!showLogin ? (
								<p className="text-gray-700">
									<button onClick={() => setShowLogin(true)} className="text-blue-600 hover:text-blue-800 underline">Login</button> to manage tickets.
								</p>
							) : (
								<form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md">
									<h2 className="text-2xl font-bold mb-4">Login</h2>
									{loginError && <p className="text-red-600 mb-4">{loginError}</p>}
									<input
										type="text"
										placeholder="Username"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									<input
										type="password"
										placeholder="Password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									<div className="flex gap-3">
										<button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
											Login
										</button>
										<button
											type="button"
											onClick={() => setShowLogin(false)}
											className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
										>
											Cancel
										</button>
									</div>
								</form>
							)}
						</div>
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
