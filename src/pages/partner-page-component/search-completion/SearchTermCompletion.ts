export class SearchTermCompletion{
  completion: string;
  displayText: string;
  location:{};
  weight: number;
  constructor(completionText){
    this.displayText = completionText;
  }
}
