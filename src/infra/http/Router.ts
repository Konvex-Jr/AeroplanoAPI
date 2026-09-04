import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface.js";
import Http from "./Http.js";
import UserRoutes from "./Routes/UserRoutes.js";
import PostRoutes from "./Routes/PostRoutes.js";

export default class Router {

	protected userRoutes: UserRoutes;
	protected postRoutes: PostRoutes;

	constructor(readonly http: Http, readonly repositoryFactory: RepositoryFactoryInterface) {
		this.userRoutes = new UserRoutes(this.http, this.repositoryFactory);
		this.postRoutes = new PostRoutes(this.http, this.repositoryFactory);
	}

	init() {

		this.http.route("get", "/api/", false, async () => {
			return {
				message: "Hello World from Aeroplano API :)"
			}
		});

		this.userRoutes.init();
		this.postRoutes.init();
	}
}