export class FavoritesData {
  public static favoritesByPfArray;

  public static addFavorite(pfNummer) {
    this.favoritesByPfArray.push(pfNummer);
    console.log("added to favoritesByPfArray");

  }

  public static deleteFavorite(pfNummer) {
    let length = this.favoritesByPfArray.length - 1;
    for (let i = length; i >= 0; i--) {
      if (this.favoritesByPfArray[i] === pfNummer) {
        this.favoritesByPfArray.splice(i, 1);
        console.log("deleted from favoritesByPfArray");
      }
    }
  }

  public static isInFavorites(nummer): boolean {
    if (this.favoritesByPfArray.indexOf(nummer) > -1) {
      return true
    }
    else {
      return false
    }
    ;
  }
}
