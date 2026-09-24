export default interface UpdatePostInput {
    title: string
    description: string
    // Opcional: se não vier, a capa atual é mantida.
    image?: string
}
