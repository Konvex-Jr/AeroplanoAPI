import RepositoryFactoryInterface from "../../domain/Interfaces/RepositoryFactoryInterface";
import Http from "./Http";
import UserRoutes from "./Routes/UserRoutes";
import PostRoutes from "./Routes/PostRoutes";

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
				message: "welcome"
			}
		});

		this.userRoutes.init();
		this.postRoutes.init();
	}
}